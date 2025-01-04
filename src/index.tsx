import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ReactDOM from "react-dom/client"
import App from "./App"
import { TonConnectUIProvider } from "@tonconnect/ui-react"

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const manifestUrl = "https://wiremail.github.io/galaxyton/tonconnect-manifest.json"

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

ReactDOM
  .createRoot(document.getElementById("root") as HTMLElement)
  .render(
    // <TonConnectUIProvider manifestUrl={manifestUrl}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    //</TonConnectUIProvider> 
  )
