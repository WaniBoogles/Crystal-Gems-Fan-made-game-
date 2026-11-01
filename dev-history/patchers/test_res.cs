using System;
using System.IO;
using System.Reflection;

public class Program {
    public static void Main() {
        var asm = Assembly.GetExecutingAssembly();
        using (var stream = asm.GetManifestResourceStream("CrystalGems.html")) {
            if (stream == null) {
                Console.WriteLine("Resource not found!");
                return;
            }
            Console.WriteLine("Resource size: " + stream.Length);
        }
    }
}
