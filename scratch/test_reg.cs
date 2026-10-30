using System;
using Microsoft.Win32;

public class Program {
    public static void Main() {
        try {
            using (var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe")) {
                Console.WriteLine("Key: " + (key != null));
            }
        } catch (Exception ex) {
            Console.WriteLine("Ex: " + ex.Message);
        }
    }
}
