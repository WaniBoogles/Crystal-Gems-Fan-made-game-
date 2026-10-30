using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;
using Microsoft.Win32;

[assembly: AssemblyTitle("Crystal Gems: Crystal Guardians Unleashed")]
[assembly: AssemblyDescription("Crystal Gems - Steven Universe Beat 'Em Up Action Game")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyCompany("Steven Universe / Cartoon Network Fans")]
[assembly: AssemblyProduct("Crystal Gems!")]
[assembly: AssemblyCopyright("Steven Universe Fans")]
[assembly: AssemblyTrademark("Crystal Gems")]
[assembly: AssemblyCulture("")]
[assembly: AssemblyVersion("1.5.0.0")]
[assembly: AssemblyFileVersion("1.5.0.0")]

public class CrystalGemsLauncher {
    [DllImport("user32.dll")]
    private static extern bool SetProcessDPIAware();

    private static HttpListener listener;
    private static Thread serverThread;
    private static volatile bool isRunning = true;
    private static byte[] cachedHtmlBytes;
    private static int serverPort = 0;
    private static DateTime lastActivityTime = DateTime.Now;

    [STAThread]
    public static void Main(string[] args) {
        try {
            // Enable crisp high-DPI rendering on modern 4K/1080p displays
            try { SetProcessDPIAware(); } catch {}

            // Prevent multiple conflicting background server instances
            bool createdNew;
            using (var mutex = new Mutex(true, "CrystalGemsGameLauncherMutex", out createdNew)) {
                // 1. Resolve Game HTML Payload
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                string localHtmlPath = Path.Combine(baseDir, "Crystal-Gems.html");
                if (!File.Exists(localHtmlPath)) {
                    localHtmlPath = Path.Combine(baseDir, "Crystal-Gems-Mobile.html");
                }
                if (!File.Exists(localHtmlPath)) {
                    localHtmlPath = Path.Combine(baseDir, "index.html");
                }

                // If local file exists, read it
                if (File.Exists(localHtmlPath)) {
                    try {
                        cachedHtmlBytes = File.ReadAllBytes(localHtmlPath);
                    } catch {}
                }

                // If not found next to exe, extract from embedded assembly resource
                if (cachedHtmlBytes == null || cachedHtmlBytes.Length == 0) {
                    var asm = Assembly.GetExecutingAssembly();
                    using (var resStream = asm.GetManifestResourceStream("CrystalGems.html")) {
                        if (resStream != null) {
                            cachedHtmlBytes = new byte[resStream.Length];
                            int totalRead = 0;
                            while (totalRead < cachedHtmlBytes.Length) {
                                int read = resStream.Read(cachedHtmlBytes, totalRead, cachedHtmlBytes.Length - totalRead);
                                if (read <= 0) break;
                                totalRead += read;
                            }
                        }
                    }
                }

                // Ensure a cached copy exists on disk in LocalAppData or Temp
                string diskFilePath = localHtmlPath;
                if (!File.Exists(diskFilePath) && cachedHtmlBytes != null && cachedHtmlBytes.Length > 0) {
                    try {
                        string appDataDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "CrystalGems");
                        if (!Directory.Exists(appDataDir)) Directory.CreateDirectory(appDataDir);
                        diskFilePath = Path.Combine(appDataDir, "Crystal-Gems.html");
                        File.WriteAllBytes(diskFilePath, cachedHtmlBytes);
                    } catch {
                        diskFilePath = Path.Combine(Path.GetTempPath(), "Crystal-Gems.html");
                        try { File.WriteAllBytes(diskFilePath, cachedHtmlBytes); } catch {}
                    }
                }

                // 2. Start Embedded Local Loopback Web Server (0 CORS, 100% offline)
                serverPort = StartLocalServer();

                // Build Target URLs
                string httpUrl = (serverPort > 0) ? ("http://127.0.0.1:" + serverPort + "/") : null;
                string fileUrl = File.Exists(diskFilePath) ? new Uri(diskFilePath).AbsoluteUri : null;

                // Prefer httpUrl for full Web Audio / ServiceWorker support, fallback to fileUrl
                string targetUrl = httpUrl ?? fileUrl;
                if (string.IsNullOrEmpty(targetUrl)) {
                    targetUrl = "http://127.0.0.1:8080/";
                }

                // 3. Find Best Browser (Microsoft Edge, Google Chrome, Brave)
                string browserPath = FindBestBrowser();
                Process browserProcess = null;

                if (!string.IsNullOrEmpty(browserPath)) {
                    // Launch in clean borderless App Mode with 1280x720 window
                    string appArgs = string.Format(
                        "--app=\"{0}\" --window-size=1280,720 --start-maximized --disable-features=Translate,InterestFeedContentSuggestions --disable-session-crashed-bubble --autoplay-policy=no-user-gesture-required",
                        targetUrl
                    );
                    var psi = new ProcessStartInfo {
                        FileName = browserPath,
                        Arguments = appArgs,
                        UseShellExecute = false
                    };
                    try {
                        browserProcess = Process.Start(psi);
                    } catch {
                        browserProcess = null;
                    }
                }

                // Fallback: Launch default system browser
                if (browserProcess == null) {
                    try {
                        var psiDefault = new ProcessStartInfo(targetUrl) {
                            UseShellExecute = true
                        };
                        browserProcess = Process.Start(psiDefault);
                    } catch {
                        if (!string.IsNullOrEmpty(fileUrl) && fileUrl != targetUrl) {
                            try {
                                Process.Start(new ProcessStartInfo(fileUrl) { UseShellExecute = true });
                            } catch {}
                        }
                    }
                }

                // 4. Server Lifecycle & Activity Management
                if (serverPort > 0) {
                    lastActivityTime = DateTime.Now;
                    // Keep the server alive while active, or up to 8 hours for gaming sessions
                    DateTime sessionStart = DateTime.Now;
                    while (isRunning) {
                        Thread.Sleep(1000);
                        // If browser process exited and was a standalone non-broker instance, or 8 hours elapsed
                        if (browserProcess != null && browserProcess.HasExited && (DateTime.Now - sessionStart).TotalSeconds > 10) {
                            // If no requests in last 25 seconds, terminate cleanly
                            if ((DateTime.Now - lastActivityTime).TotalSeconds > 25) {
                                break;
                            }
                        }
                        if ((DateTime.Now - sessionStart).TotalHours > 8) {
                            break;
                        }
                    }
                }
            }
        } catch {
            // Absolute failsafe fallback: try shell execute on any local HTML file
            try {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                string h = Path.Combine(baseDir, "Crystal-Gems.html");
                if (File.Exists(h)) {
                    Process.Start(new ProcessStartInfo(h) { UseShellExecute = true });
                }
            } catch {}
        } finally {
            StopLocalServer();
        }
    }

    private static int StartLocalServer() {
        int[] candidatePorts = new int[] { 54321, 58921, 49152, 51234, 61234, 0 };
        foreach (int port in candidatePorts) {
            try {
                int testPort = port;
                if (testPort == 0) {
                    var tcp = new System.Net.Sockets.TcpListener(IPAddress.Loopback, 0);
                    tcp.Start();
                    testPort = ((IPEndPoint)tcp.LocalEndpoint).Port;
                    tcp.Stop();
                }

                var testListener = new HttpListener();
                testListener.Prefixes.Add("http://127.0.0.1:" + testPort + "/");
                testListener.Start();

                listener = testListener;
                isRunning = true;
                serverThread = new Thread(ServerWorker) {
                    IsBackground = true,
                    Name = "CrystalGemsHttpServer"
                };
                serverThread.Start();
                return testPort;
            } catch {}
        }
        return 0;
    }

    private static void StopLocalServer() {
        isRunning = false;
        try {
            if (listener != null && listener.IsListening) {
                listener.Stop();
                listener.Close();
            }
        } catch {}
    }

    private static void ServerWorker() {
        while (isRunning && listener != null && listener.IsListening) {
            try {
                var context = listener.GetContext();
                lastActivityTime = DateTime.Now;
                ThreadPool.QueueUserWorkItem((ctxObj) => {
                    var ctx = (HttpListenerContext)ctxObj;
                    try {
                        string path = ctx.Request.Url.AbsolutePath.ToLowerInvariant();
                        if (path == "/quit" || path == "/exit") {
                            byte[] quitMsg = Encoding.UTF8.GetBytes("Goodbye!");
                            ctx.Response.StatusCode = 200;
                            ctx.Response.ContentType = "text/plain";
                            ctx.Response.OutputStream.Write(quitMsg, 0, quitMsg.Length);
                            ctx.Response.Close();
                            isRunning = false;
                            return;
                        }

                        if (path == "/ping" || path == "/health") {
                            byte[] pingMsg = Encoding.UTF8.GetBytes("OK");
                            ctx.Response.StatusCode = 200;
                            ctx.Response.ContentType = "text/plain";
                            ctx.Response.OutputStream.Write(pingMsg, 0, pingMsg.Length);
                            ctx.Response.Close();
                            return;
                        }

                        // Serve Crystal-Gems.html
                        if (cachedHtmlBytes != null && cachedHtmlBytes.Length > 0) {
                            ctx.Response.StatusCode = 200;
                            ctx.Response.ContentType = "text/html; charset=utf-8";
                            ctx.Response.Headers.Add("Access-Control-Allow-Origin", "*");
                            ctx.Response.Headers.Add("Cache-Control", "no-cache");
                            ctx.Response.ContentLength64 = cachedHtmlBytes.Length;
                            ctx.Response.OutputStream.Write(cachedHtmlBytes, 0, cachedHtmlBytes.Length);
                        } else {
                            ctx.Response.StatusCode = 404;
                        }
                        ctx.Response.Close();
                    } catch {}
                }, context);
            } catch {
                if (!isRunning) break;
            }
        }
    }

    private static string FindBestBrowser() {
        // Priority 1: Microsoft Edge (Preinstalled on all Windows 10 & 11 PCs)
        string[] edgePaths = new string[] {
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Microsoft\Edge\Application\msedge.exe")
        };
        foreach (var p in edgePaths) {
            if (!string.IsNullOrEmpty(p) && File.Exists(p)) return p;
        }

        try {
            using (var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe")) {
                if (key != null) {
                    var val = key.GetValue("") as string;
                    if (!string.IsNullOrEmpty(val) && File.Exists(val)) return val;
                }
            }
        } catch {}

        // Priority 2: Google Chrome
        string[] chromePaths = new string[] {
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Google\Chrome\Application\chrome.exe")
        };
        foreach (var p in chromePaths) {
            if (!string.IsNullOrEmpty(p) && File.Exists(p)) return p;
        }

        try {
            using (var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe")) {
                if (key != null) {
                    var val = key.GetValue("") as string;
                    if (!string.IsNullOrEmpty(val) && File.Exists(val)) return val;
                }
            }
        } catch {}

        // Priority 3: Brave
        string[] bravePaths = new string[] {
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"BraveSoftware\Brave-Browser\Application\brave.exe"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"BraveSoftware\Brave-Browser\Application\brave.exe"),
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"BraveSoftware\Brave-Browser\Application\brave.exe")
        };
        foreach (var p in bravePaths) {
            if (!string.IsNullOrEmpty(p) && File.Exists(p)) return p;
        }

        return null;
    }
}
