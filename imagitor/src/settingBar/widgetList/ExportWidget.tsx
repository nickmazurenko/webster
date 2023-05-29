import { Group } from "konva/lib/Group";
import { Node, NodeConfig } from "konva/lib/Node";
import React from "react";
import { Col, Figure, Row } from "react-bootstrap";
import { SettingBarProps } from "..";
import exportList from "../../config/export.json";
import useSelection from "../../hook/useSelection";
import useStage from "../../hook/useStage";
import useI18n from "../../hook/usei18n";
import alignStyles from "../../style/align.module.css";
import fontStyles from "../../style/font.module.css";
import sizeStyles from "../../style/size.module.css";
import { WidgetKind } from "../Widget";

export type ExportKind = {
  "data-item-type": string;
  id: string;
  icon: string;
  name: string;
  selectedItems: Node<NodeConfig>[];
  clearSelection: ReturnType<typeof useSelection>["clearSelection"];
  stageRef: ReturnType<typeof useStage>["stageRef"];
};

type ExportWidgetProps = {
  data: WidgetKind & SettingBarProps;
};

const ExportWidget: React.FC<ExportWidgetProps> = ({ data }) => (
  <Col>
    <Row>
      {exportList.map((_data) => (
        <ExportThumbnail
          key={`export-thumbnail-${_data.id}`}
          data={{
            id: _data.id,
            icon: _data.icon,
            name: _data.name,
            "data-item-type": "export",
            selectedItems: data.selectedItems,
            clearSelection: data.clearSelection,
            stageRef: data.stageRef,
          }}
        />
      ))}
    </Row>
  </Col>
);

export default ExportWidget;

const ExportThumbnail: React.FC<{
  data: ExportKind;
}> = ({ data }) => {
  const { getTranslation } = useI18n();

  const downloadSelected = (targetFrame?: Node<NodeConfig> | Group) => {
    const link = document.createElement("a");
    const frame = data.stageRef.current.getLayers()[0];

    if (frame) {
      const stage = frame.getStage()!;
      console.log(stage);
      data.clearSelection();
      const uri = stage.toDataURL({
        x: frame.getClientRect().x,
        y: frame.getClientRect().y,
        width: frame.attrs.width * stage.scaleX(),
        height: frame.attrs.height * stage.scaleY(),
        pixelRatio: 1 / stage.scaleX(),
      });
      if (uri) {
        link.download = "export.png";
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const downloadAll = () => {
    const frames = data.stageRef.current.getChildren()[0].getChildren((item) => item.attrs.name === "label-group");
    frames
      .map((frame) => (frame as Group).getChildren((item) => item.attrs.name === "label-target")[0])
      .forEach((frame) => {
        downloadSelected(frame as Node<NodeConfig>);
      });
  };

  const onClickDownload = (exportId: string) => () => {
    if (exportId === "export-all-frame") {
      downloadAll();
      return;
    }
    downloadSelected();
  };

  return (
    <Figure
      as={Col}
      onClick={onClickDownload(data.id)}
      className={[alignStyles.absoluteCenter, alignStyles.wrapTrue].join(" ")}
    >
      <i className={`bi-${data.icon}`} style={{ fontSize: 20, width: 25 }} />
      <Figure.Caption className={[fontStyles.font075em, sizeStyles.width100, "text-center"].join(" ")}>
        {`${getTranslation("widget", "export", data.id, "name")}`}
      </Figure.Caption>
    </Figure>
  );
};
