import React, { useState } from 'react';
import { Steps, Row, Button, Upload, Col, Input, Statistic } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { ArtCard } from './../../components/ArtCard';
import './styles.less';
import { mintNFT } from '../../models';
import { useConnection, useWallet } from '@oyster/common';

const { Step } = Steps;
const { Dragger } = Upload;

interface IProps {
  type: String;
  title: String;
  description: String;
  files: File[];
}

export const ArtCreateView = () => {
  const connection = useConnection();
  const { wallet, connected } = useWallet();
  const [step, setStep] = useState(0);
  const [attributes, setAttributes] = useState<IProps>({
    type: 'image',
    title: '',
    description: '',

    files: [],
  });

  // store files
  const mint = () => {
    mintNFT(connection, wallet, attributes.files, attributes);
  };

  return (
    <>
      <Row style={{ paddingTop: 50 }}>
        <Col xl={5}>
          <Steps
            progressDot
            direction="vertical"
            current={step}
            style={{ width: 200, marginLeft: 20, marginRight: 30 }}
          >
            <Step title="Category" />
            <Step title="Upload" />
            <Step title="Info" />
            <Step title="Royalties" />
            <Step title="Launch" />
          </Steps>
        </Col>
        <Col xl={16}>
          {step === 0 && (
            <CategoryStep
              confirm={type => {
                setAttributes({
                  ...attributes,
                  type,
                });
                setStep(1);
              }}
            />
          )}
          {step === 1 && (
            <UploadStep
              attributes
              setAttributes={setAttributes}
              confirm={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <InfoStep confirm={() => mint()} attributes={attributes} />
          )}
        </Col>
      </Row>
    </>
  );
};

const CategoryStep = (props: { confirm: (type: string) => void }) => {
  return (
    <>
      <Row className="call-to-action">
        <h2>Create your NFT artwork on Meta</h2>
        <p>
          Creating NFT on Solana is not only low cost for artists but supports
          environment with 20% of the fees form the platform donated to
          charities.
        </p>
      </Row>
      <Row>
        <Col xl={6}>
          <Button
            className="type-btn"
            size="large"
            onClick={() => props.confirm('image')}
          >
            Image
          </Button>
        </Col>
        <Col xl={6}>
          <Button
            className="type-btn"
            size="large"
            onClick={() => props.confirm('video')}
          >
            Video
          </Button>
        </Col>
        <Col xl={6}>
          <Button
            className="type-btn"
            size="large"
            onClick={() => props.confirm('audio')}
          >
            Audio
          </Button>
        </Col>
      </Row>
    </>
  );
};

const UploadStep = (props: {
  attributes: any;
  setAttributes: (attr: any) => void;
  confirm: () => void;
}) => {
  return (
    <>
      <Row className="call-to-action">
        <h2>Now, let's upload your creation</h2>
        <p>
          Your file will be uploaded to the decentralized web via Arweave.
          Depending on file type, can take up to 1 minute. Arweave is a new type
          of storage that backs data with sustainable and perpetual endowments,
          allowing users and developers to truly store data forever – for the
          very first time.
        </p>
      </Row>
      <Row className="content-action">
        <Dragger
          multiple={false}
          customRequest={info => {
            // dont upload files here, handled outside of the control
            info?.onSuccess?.({}, null as any);
          }}
          style={{ padding: 20 }}
          onChange={info => {
            props.setAttributes({
              ...props.attributes,
              files: [info.file.originFileObj],
            });
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Dragger>
      </Row>
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={props.confirm}
          className="action-btn"
        >
          Continue to Mint
        </Button>
      </Row>
    </>
  );
};

const InfoStep = (props: { confirm: () => void; attributes: IProps }) => {
  const file = props.attributes.files[0];
  return (
    <>
      <Row className="call-to-action">
        <h2>Describe your creation</h2>
        <p>
          Provide detailed description of your creative process to engage with
          your audience.
        </p>
      </Row>
      <Row className="content-action">
        <Col xl={12}>{file && <ArtCard file={file} />}</Col>
        <Col className="section" xl={12}>
          <Input className="input" placeholder="Title" />
          <Input.TextArea
            className="input textarea"
            placeholder="Description"
          />
        </Col>
      </Row>
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={props.confirm}
          className="action-btn"
        >
          Continue to royalties
        </Button>
      </Row>
    </>
  );
};

const RoyaltiesStep = (props: { confirm: () => void; attributes: IProps }) => {
  const file = props.attributes.files[0];

  return (
    <>
      <Row className="call-to-action">
        <h2>Set royalties for the creation</h2>
        <p>
          A royalty is a payment made by one the seller of this item to the
          creator. It is charged after every successful auction.
        </p>
      </Row>
      <Row className="content-action">
        <Col xl={12}>{file && <ArtCard file={file} />}</Col>
        <Col className="section" xl={12}>
          <Input className="input" placeholder="Title" />
          <Input.TextArea
            className="input textarea"
            placeholder="Description"
          />
        </Col>
      </Row>
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={props.confirm}
          className="action-btn"
        >
          Continue to review
        </Button>
      </Row>
    </>
  );
};

const LaunchStep = (props: { confirm: () => void; attributes: IProps }) => {
  const file = props.attributes.files[0];

  return (
    <>
      <Row className="call-to-action">
        <h2>Launch your creation</h2>
        <p>
          Provide detailed description of your creative process to engage with
          your audience.
        </p>
      </Row>
      <Row className="content-action">
        <Col xl={12}>{file && <ArtCard file={file} />}</Col>
        <Col className="section" xl={12}>
          <Statistic
            className="create-statistic"
            title="Royalty Percentage"
            value={20}
            suffix="%"
          />
          <Statistic
            className="create-statistic"
            title="Cost to Create"
            value={20}
            prefix="◎"
          />
        </Col>
      </Row>
      <Row>
        <Button
          type="primary"
          size="large"
          onClick={props.confirm}
          className="action-btn"
        >
          Pay with SOL
        </Button>
        <Button
          disabled={true}
          size="large"
          onClick={props.confirm}
          className="action-btn"
        >
          Pay with Credit Card
        </Button>
      </Row>
    </>
  );
};
