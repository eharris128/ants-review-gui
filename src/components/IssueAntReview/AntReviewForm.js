import React from "react";
import { Form, Input, Tooltip, Button, DatePicker } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment";

const AntReviewForm = (props) => {
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
    const dueDateInUnix = moment(values.dueDate).valueOf();
    const { ipfsHash, ethRewardAmount } = values;

    const submitPayload = {
      ipfsHash,
      ethRewardAmount,
      dueDate: dueDateInUnix,
    };
    onSubmit(submitPayload);
  };

  const onFill = () => {
    form.setFieldsValue({
      ipfsHash: "QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t",
      ethRewardAmount: 0.1,
      dueDate: moment().add(1, "days"),
    });
  };

  return (
    <>
      <Form
        id="issueAntReviewForm"
        form={form}
        {...layout}
        name="basic"
        onFinish={onFinish}
      >
        <Form.Item
          label="IPFS Hash"
          name="ipfsHash"
          rules={[{ required: true, message: "Please input your IPFS hash!" }]}
        >
          <Input
            placeholder="QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t"
            suffix={
              <Tooltip title="The hash of the paper to be reviewed.">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
        </Form.Item>

        <Form.Item
          label="ETH Reward Amount"
          name="ethRewardAmount"
          rules={[
            {
              required: true,
              message: "Please input your ETH reward amount!",
            },
          ]}
        >
          <Input
            placeholder="0.1"
            suffix={
              <Tooltip title="The amount of ETH you want to provide to the peer reviewer.">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
        </Form.Item>
        <Form.Item
          label="Due Date"
          name="dueDate"
          rules={[{ required: true, message: "Please select a due date!" }]}
        >
          <DatePicker
            disabledDate={(current) =>
              current && current.valueOf() < Date.now()
            }
            placeholder="Select Due Date"
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

export default AntReviewForm;
