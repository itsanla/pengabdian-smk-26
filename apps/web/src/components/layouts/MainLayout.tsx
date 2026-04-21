// Moggo diedit, Do, buat landing page v:

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>Navbar Landing</header>
      <main>{children}</main>
      <footer>Copyright &copy; Politeknik Negeri Padang 2025 </footer>
    </div>
  )
}
