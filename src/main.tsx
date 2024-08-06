import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ChakraProvider disableGlobalStyle resetCSS>
				<App onClose={() => console.log('onclose')} />
			</ChakraProvider>
		</QueryClientProvider>
	</React.StrictMode>
)
