import React, { useEffect, useState, useRef } from "react";
import { debounce } from "lodash-es";
import "./App.css";
import { Button, message } from "antd";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";

const MENU_ID = "__translate_it__";

function App() {
  const [enable, setEnable] = useState(false);
  const [text, setText] = useState("");
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  useEffect(() => {
    const handleMouseUp = debounce(function (e: MouseEvent) {
      if (!enable) {
        return;
      }
      const selection = window.getSelection();
      if (selection) {
        if (selection.toString()) {
          setText(selection.toString());
          show({
            event: e,
          });
        }
      }
    }, 500);

    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [enable]);

  useEffect(() => {
    const handleMessage = (request: any, sender: any, sendResponse: any) => {
      if (request.text) {
        message.info(
          <>
            <strong>Translate it result:</strong>
            <div>{request.text}</div>
            <div>{request.result}</div>
          </>
        );
      }
      return true;
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  useEffect(() => {
    chrome.storage.sync.get(["enable"], async function (result: any) {
      setEnable(result.enable);
    });
  }, []);

  return (
    <Menu id={MENU_ID}>
      <Item
        id="trans"
        style={{ justifyContent: "center" }}
        onClick={() => {
          chrome.runtime.sendMessage({ text }, function (response: any) {});
          window.getSelection()?.empty();
        }}
      >
        translate it.
      </Item>
    </Menu>
  );
}

export default App;
