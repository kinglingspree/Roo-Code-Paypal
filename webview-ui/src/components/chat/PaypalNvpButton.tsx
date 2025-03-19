import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import React, { useState } from "react"
const prompt = `Role:
You are now a PayPal API expert, proficient in PHP, Python, JavaScript, and shell languages, specializing in PayPal NVP API and REST API conversion.

Tasks:

1. Identify all PayPal NVP APIs in the project and find the context for each API (i.e., where this API is being used)
2. Establish the correct mapping relationship between NVP API and REST API based on PayPal payment processes and interface documentation
3. Convert these NVP APIs to PayPal REST APIs, ensuring that each API context reference can run correctly
4. The response results of PayPal NVP API and REST API are different. Please refer to the conversion relationship in @nvp-test.txt to convert the REST API response to the NVP response format. Only perform the conversion when returning at the end of the method. Intermediate responses do not need to be converted to avoid problems with multiple conversions
5. Minimize modifications to frontend code and glue code, ensuring that the frontend interface and other code can work normally

Requirements:

- Please separately define variables to represent PayPal REST API BaseUrl, ClientID, and Secret, and define functions to obtain access tokens
- For all PayPal REST APIs, HTTP status codes 200 and 201 both indicate success
- For the /v2/checkout/order order creation interface, if needed, avoid using application_context and use payment_source instead. When getting the order URL link, use rel = approve or rel = payer-action
- Please ensure that the converted REST interface includes all necessary parameters. For example, with SetExpressCheckout, when parameters include items, the parameters should also include breakdown-related parameters`

interface PaypalNvpButtonProps {
	onSendMessage: (text: string, images: string[]) => void
}

const PaypalNvpButton: React.FC<PaypalNvpButtonProps> = ({ onSendMessage }) => {
	const [clientId, setClientId] = useState("")
	const [secret, setSecret] = useState("")

	const handleSend = () => {
		const updatedPrompt = `${prompt}\n- Among them, Client ID: ${clientId}, Secret: ${secret}`
		onSendMessage(updatedPrompt, [])
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				padding: "10px 15px 0px 15px",
				gap: "10px",
			}}>
			<div style={{ display: "flex", gap: "10px" }}>
				<VSCodeTextField
					value={clientId}
					onChange={(e) => setClientId((e.target as HTMLInputElement).value)}
					placeholder="PayPal Client ID"
					style={{ flex: 1 }}
				/>
				<VSCodeTextField
					value={secret}
					onChange={(e) => setSecret((e.target as HTMLInputElement).value)}
					placeholder="PayPal Secret"
					style={{ flex: 1 }}
				/>
			</div>
			<VSCodeButton
				appearance="primary"
				style={{
					flex: 2,
					backgroundColor: "var(--vscode-button-background)",
					color: "var(--vscode-button-foreground)",
				}}
				onClick={handleSend}>
				PPCP order convertor
			</VSCodeButton>
		</div>
	)
}

export default PaypalNvpButton
