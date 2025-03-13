
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group glass-card relative overflow-hidden border-0 backdrop-blur-lg bg-gradient-to-r from-[#8B5CF6]/10 to-[#D946EF]/10 text-foreground",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-[#8B5CF6] group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-white",
          success: "group glass-card border-0 bg-gradient-to-r from-neon-blue/20 to-neon-violet/20 text-white",
          error: "group glass-card border-0 bg-gradient-to-r from-neon-pink/20 to-red-500/20 text-white",
          info: "group glass-card border-0 bg-gradient-to-r from-neon-blue/20 to-neon-pink/20 text-white",
          closeButton: "group-[.toast]:text-white/70 group-[.toast]:hover:text-white group-[.toast]:focus:ring-0",
        },
        duration: 5000,
      }}
      {...props}
    />
  )
}

export { Toaster }
