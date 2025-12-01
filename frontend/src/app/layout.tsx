import './globals.css'

export const metadata = {
  title: 'Shadow Alpha | Track Elite Whales',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
