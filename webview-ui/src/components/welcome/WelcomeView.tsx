import { useCallback, useState, useEffect } from "react"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"

import { useExtensionState } from "../../context/ExtensionStateContext"
import { validateApiConfiguration } from "../../utils/validate"
import { vscode } from "../../utils/vscode"
import ApiOptions from "../settings/ApiOptions"
import { Tab, TabContent } from "../common/Tab"
import { Alert } from "../common/Alert"
import { useAppTranslation } from "../../i18n/TranslationContext"
import { ApiConfiguration } from "../../../../src/shared/api"
import { TelemetrySetting } from "../../../../src/shared/TelemetrySetting"

const WelcomeView = () => {
	const { apiConfiguration, currentApiConfigName, setApiConfiguration, uriScheme } = useExtensionState()
	const { t } = useAppTranslation()

	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

	// 添加默认配置
	useEffect(() => {
		// 设置默认配置并自动保存，无论是否已有配置
		const defaultConfig = {
			apiProvider: "openai" as const, // "openai" 对应 UI 中的 "OpenAI Compatible"
			openAiBaseUrl:
				"https://api-ingress-internal-staging-hrz.g.cneast.gopayqa.com.cn/llm-service-backend-serv/v1",
			openAiApiKey:
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiamluYm9saSIsImRlc2NyaXB0aW9uIjoiSmluYm8gTGkgLSBwZXJtaXNzaW9uIGZvciBjYWxsIExMTSBzZXJ2aWNlIiwiaWF0IjoxNzM5MzMwOTM0fQ.QYwVThDQYL4YbEzv9Udeq2XCYrg_6p3RPOqWn4ROAr0",
			openAiModelId: "DeepSeek-V3-0324",
		} as ApiConfiguration

		// 设置默认配置
		setApiConfiguration(defaultConfig)

		// 延迟一点时间后自动提交，确保状态已更新
		setTimeout(() => {
			vscode.postMessage({
				type: "upsertApiConfiguration",
				text: currentApiConfigName || "default",
				apiConfiguration: defaultConfig,
			})
			vscode.postMessage({ type: "telemetrySetting", text: "disabled" satisfies TelemetrySetting })
		}, 500)
	}, [currentApiConfigName, setApiConfiguration]) // 移除 apiConfiguration 依赖，确保每次都设置默认值

	const handleSubmit = useCallback(() => {
		const error = validateApiConfiguration(apiConfiguration)

		if (error) {
			setErrorMessage(error)
			return
		}

		setErrorMessage(undefined)
		vscode.postMessage({ type: "upsertApiConfiguration", text: currentApiConfigName, apiConfiguration })
	}, [apiConfiguration, currentApiConfigName])

	return (
		<Tab>
			<TabContent className="flex flex-col gap-5">
				<h2 className="m-0 p-0">{t("welcome:greeting")}</h2>
				<div>{t("welcome:introduction")}</div>
				<Alert className="font-bold text-sm">{t("welcome:notice")}</Alert>
				<ApiOptions
					fromWelcomeView
					apiConfiguration={apiConfiguration || {}}
					uriScheme={uriScheme}
					setApiConfigurationField={(field, value) =>
						setApiConfiguration({ ...apiConfiguration, [field]: value })
					}
					errorMessage={errorMessage}
					setErrorMessage={setErrorMessage}
				/>
			</TabContent>
			<div className="sticky bottom-0 bg-vscode-sideBar-background p-5">
				<div className="flex flex-col gap-1">
					<VSCodeButton onClick={handleSubmit}>{t("welcome:start")}</VSCodeButton>
					{errorMessage && <div className="text-vscode-errorForeground">{errorMessage}</div>}
				</div>
			</div>
		</Tab>
	)
}

export default WelcomeView
