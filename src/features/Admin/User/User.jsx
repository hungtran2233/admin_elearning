import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Button,
  Space,
  Spin,
  Select,
} from "antd";
import instance from "api/instance";
import React, { useEffect, useState, useRef } from "react";
import "./users.scss";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";

import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { fetchUsersListAction } from "./utils/userAction";
import { Option } from "antd/lib/mentions";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const originData = [];
const User = ({ users, fetchUsers }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [select, setSelect] = useState("");
  const [editingKey, setEditingKey] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const usersList = useSelector((state) => state.user.userList);
  const navigate = useNavigate();

  const test = usersList?.map((user, index) => ({
    ...user,
    key: index,
    maNhom: "GP01",
  }));

  const handeChangeUser = (value) => {
    setSelect(value);
  };
  const isEditing = (record) => record.key === editingKey;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  //input search
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  //call api Edit User
  const postEdit = async (user) => {
    try {
      const res = await instance.request({
        url: "/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
        method: "PUT",
        data: user,
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Sửa Thành Công !",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchUsersAction();
    } catch (error) {
      Swal.fire({
        title: error.response.data.content,
        text: "Không Thể Sửa",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  //call api Delete User
  const deleteUsers = async (user) => {
    console.log(user);
    try {
      const res = await instance.request({
        url: "/api/QuanLyNguoiDung/XoaNguoiDung",
        method: "DELETE",
        params: {
          TaiKhoan: user,
        },
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Xóa Thành Công !",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchUsersAction();
    } catch (error) {
      console.log(error.response.data.content);
      Swal.fire({
        title: error.response.data.content,
        text: "Không Thể Xóa",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const edit = (record) => {
    form.setFieldsValue({
      taiKhoan: "",
      hoTen: "",
      soDT: "",
      email: "",
      maLoaiNguoiDung: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();

      const user = { ...test[key], ...row, maLoaiNguoiDung: select };
      console.log(user);
      postEdit(user);
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const fetchUsersAction = () => {
    dispatch(fetchUsersListAction());
  };
  useEffect(() => {
    fetchUsersAction();
  }, []);
  if (!usersList) return <Spin></Spin>;
  const columns = [
    {
      title: "Tài Khoản",
      dataIndex: "taiKhoan",
      width: "15%",
      editable: false,
      ...getColumnSearchProps("taiKhoan"),
    },
    {
      title: "Họ Tên",
      dataIndex: "hoTen",
      width: "25%",
      editable: true,
      ...getColumnSearchProps("hoTen"),
    },

    {
      title: "Điện Thoại",
      dataIndex: "soDt",
      width: "10%",
      editable: true,
      ...getColumnSearchProps("soDT"),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "15%",
      editable: true,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phân Loại",
      dataIndex: "maLoaiNguoiDung",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Select
              onChange={handeChangeUser}
              defaultValue={record.maLoaiNguoiDung}
            >
              <Select.Option value="HV">Học Viên</Select.Option>
              <Select.Option value="GV">Giáo Vụ</Select.Option>
            </Select>
          </span>
        ) : (
          <span>
            <Select
              disabled
              onChange={handeChangeUser}
              defaultValue={record.maLoaiNguoiDung}
            >
              <Select.Option value="HV">Học Viên</Select.Option>
              <Select.Option value="GV">Giáo Vụ</Select.Option>
            </Select>
          </span>
        );
      },
      filters: [
        {
          text: "Giáo Vụ",
          value: "GV",
        },
        {
          text: "Học Viên",
          value: "HV",
        },
      ],
      onFilter: (value, record) => record.maLoaiNguoiDung.indexOf(value) === 0,
      width: "15%",
      //  editable: true,
    },
    {
      title: "Chức Năng",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Quay Lại?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              style={{
                marginRight: 8,
              }}
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <Popconfirm
              title="Bạn Chắc Muốn Xóa?"
              onConfirm={() => {
                deleteUsers(record.taiKhoan);
              }}
            >
              <a>Delete</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  // useEffect(()=>{
  //   // fetchUsers()
  // },[])
  return (
    <>
      <h1 style={{ fontSize: 20 }}>Quản lý người dùng</h1>
      <Button
        onClick={() => {
          navigate("/admin/user/add");
        }}
        className="btn-add"
      >
        {" "}
        <UserAddOutlined />
        Thêm Người Dùng
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={test}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            style: { textAlign: "center" },
            onChange: cancel,
          }}
        />
      </Form>
    </>
  );
};

export default User;
