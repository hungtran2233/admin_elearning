import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
} from "antd";
import instance from "api/instance";
//   import { fetchUsersListAction } from "features/Admin/utils/adminAction";
import { fetchUsersListAction } from "../../utils/userAction";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./_signUp.scss";
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const SignUp = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [contentError, setContentErro] = useState("");
  const navigate = useNavigate();
  const ditpatch = useDispatch();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="+84">+84</Option>
        <Option value="0">+0084</Option>
      </Select>
    </Form.Item>
  );
  const addUsersApi = async (user) => {
    try {
      setLoading(true);
      const res = await instance.request({
        url: "/api/QuanLyNguoiDung/ThemNguoiDung",
        method: "POST",
        data: user,
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Thêm Thành Công !",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchUser();
      setLoading(false);

      navigate("/admin/user");
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: error.response.data.content,
        text: "Chưa Thêm Được",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchUser = () => {
    ditpatch(fetchUsersListAction());
  };
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={(values) => {
        addUsersApi({ ...values, maNhom: "GP01" });
      }}
      initialValues={{
        residence: ["zhejiang", "hangzhou", "xihu"],
        prefix: "+84",
      }}
      scrollToFirstError
    >
      <Form.Item
        name="hoTen"
        label="Họ và Tên"
        tooltip="What do you want others to call you?"
        rules={[
          {
            required: true,
            message: "Vui Lòng Nhập Họ Tên!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="taiKhoan"
        label="Tài Khoản"
        tooltip="What do you want others to call you?"
        rules={[
          {
            required: true,
            message: "Vui Lòng Nhập Tài Khoản!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="matKhau"
        label="Mật Khẩu"
        rules={[
          {
            required: true,
            message: "Vui Lòng Nhập Mật Khẩu!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Xác Nhận Lại Mật Khẩu"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Mật Khẩu Không Đúng!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("matKhau") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "Email Không Đúng Định Dạng",
          },
          {
            required: true,
            message: "Vui Lòng Nhập Email!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="soDt"
        label="Số Điện Thoại"
        rules={[
          {
            required: true,
            message: "Vui Lòng Nhập Số Điện Thoại!",
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: "100%",
          }}
        />
      </Form.Item>

      <Form.Item
        name="maLoaiNguoiDung"
        label="Phân Quyền"
        rules={[
          {
            required: true,
            message: "Chọn Phân Quyền!",
          },
        ]}
      >
        <Select placeholder="Phân Quyền">
          <Option value="HV">Học Viên</Option>
          <Option value="GV">Giáo Vụ</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error("Đồng Ý Điều Khoản")),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          Đồng Ý<a href=""> Điều Khoản</a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button loading={loading} type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignUp;
