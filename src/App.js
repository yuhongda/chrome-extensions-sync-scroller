/* eslint-disable no-undef */
import { useLayoutEffect, useState } from "react";
import { Row, Col, Switch } from "antd";
import "./App.css";

function App() {
	const [enable, setEnable] = useState(false);

	const onChange = (value) => {
		setEnable(value);
		chrome.storage.sync.set({ enable: value });
	};

	useLayoutEffect(() => {
		window.requestAnimationFrame(() => {
			chrome.storage.sync.get(["enable"], function (result) {
				setEnable(result.enable);
			});
		});
	}, []);

	return (
		<div className="App">
			<Row gutter={[10, 10]}>
				<Col span={12} style={{ lineHeight: "26px" }}>
					同步滚动
				</Col>
				<Col span={12}>
					<Switch checked={enable} onChange={onChange} />
				</Col>
			</Row>
		</div>
	);
}

export default App;
