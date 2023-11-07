import { useState, useLayoutEffect } from "react";
import "./App.css";
import {
	ConfigProvider,
	theme,
	Row,
	Col,
	Divider,
	Switch,
	Select,
	Input,
} from "antd";
import "antd/dist/reset.css";

function App() {
	const [enable, setEnable] = useState(false);

	const onChange = (value: any) => {
		setEnable(value);
		chrome.storage.sync.set({ enable: value });
	};

	useLayoutEffect(() => {
		window.requestAnimationFrame(() => {
			chrome.storage.sync.get(["enable"], function (result: any) {
				setEnable(result.enable);
			});
		});
	}, []);

	return (
		<div className="App">
			<ConfigProvider
				theme={{
					algorithm: theme.darkAlgorithm,
				}}
			>
				<h1 style={{ textAlign: "center" }}>Sync Scroller</h1>
				<Divider>Enable</Divider>
				<Row gutter={16}>
					<Col span={24}>
						<Switch
							checkedChildren="Enabled"
							unCheckedChildren="Disabled"
							checked={enable}
							onChange={onChange}
							style={{ width: "100%" }}
						/>
					</Col>
				</Row>
			</ConfigProvider>
		</div>
	);
}

export default App;
