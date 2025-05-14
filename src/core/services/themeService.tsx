import { ThemeProvider } from "@material-ui/core";
import { createContext, ReactNode, useEffect, useState } from "react";
import { createTheme } from "@material-ui/core/styles";
interface ThemeContentType {
  theme: "light" | "dark";
  toggleTheme?: () => void;
}

const ThemeDefault: ThemeContentType = {
  theme: "light",
};

interface ChildrenProps {
  children: ReactNode;
}

export const ThemeService = createContext<ThemeContentType>(ThemeDefault);

export const ThemeWrapper = ({ children }: ChildrenProps) => {
  const saveTheme = localStorage.getItem("theme") as "light" | "dark" | null;
  const [theme, setTheme] = useState<"light" | "dark">(saveTheme || "light");
  localStorage.setItem("theme", theme);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.classList.toggle(
      "dark-theme",
      localStorage.getItem("theme") === "dark"
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((item) => (item === "light" ? "dark" : "light"));
  };

  const muiTheme = createTheme({
    palette: {
      type: theme, // <-- quan trọng
    },
  });

  return (
    <ThemeService.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </ThemeService.Provider>
  );
};
