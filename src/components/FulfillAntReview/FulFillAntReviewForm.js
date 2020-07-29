import React from "react";
import { Form, Input, Tooltip, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const FulfillAntReviewForm = (props) => {
  const { onSubmit } = props;
  const [form] = Form.useForm();

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = (values) => {
    const { ipfsHash } = values;

    const submitPayload = {
      ipfsHash,
    };
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
          <Button type="link" htmlType="button" onClick={onFill}>
            Fill form
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default FulfillAntReviewForm;
