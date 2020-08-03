import React from "react";
import { Form, Input, Tooltip, Button, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
const { Option } = Select;

const displayAntReviewOptions = (fulfillableAntReviews) => {
  return fulfillableAntReviews.map((fulfillableAntReview, index) => {
    const { data: paperHash, antReview_id: antReviewID } = fulfillableAntReview;
    const hashWithID = `${paperHash}_${antReviewID}`;
    return (
      <Option key={index} value={hashWithID}>
        {paperHash}
      </Option>
    );
  });
};

const FulfillAntReviewForm = ({
  onSubmit,
  antReviewID,
  promptForAntReview,
  fulfillableAntReviews,
}) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = (values) => {
    const { ipfsHash, antReview } = values;
    let submitPayload = {
      ipfsHash,
    };
    if (antReview) {
      // example ID - "QmZZQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t_17"
      const targetAntReviewID = antReview.split("_")[1];
      submitPayload = {
        ...submitPayload,
        antReview: targetAntReviewID,
      };
    }

    onSubmit(submitPayload);
  };

  const onFill = () => {
    form.setFieldsValue({
      ipfsHash: "QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t",
    });
  };

  return (
    <>
      <Form
        id="fulfillAntReviewForm"
        form={form}
        {...layout}
        name="basic"
        onFinish={onFinish}
      >
        {!promptForAntReview ? null : (
          <Form.Item label="AntReview" name="antReview">
            <Select
              placeholder="Select the hash of the original paper you reviewed"
              style={{ width: 450 }}
            >
              {displayAntReviewOptions(fulfillableAntReviews)}
            </Select>
          </Form.Item>
        )}
        <Form.Item
          label="IPFS Hash"
          name="ipfsHash"
          rules={[
            {
              required: true,
              message: "Please input the IPFS hash of your review!",
            },
          ]}
        >
          <Input
            placeholder="QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t"
            suffix={
              <Tooltip title="The hash of the reviewed paper.">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          {!promptForAntReview ? (
            <Button type="link" htmlType="button" onClick={onFill}>
              Fill form
            </Button>
          ) : null}
        </Form.Item>
      </Form>
    </>
  );
};

export default FulfillAntReviewForm;
