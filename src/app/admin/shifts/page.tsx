"use client";

import React, { useState } from "react";
import { Button, Input, Modal, Table, Form, message, Popconfirm, TimePicker } from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { useCrud } from "@/hooks/use-crud";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ShiftType } from "@/types/shift";
import dayjs from "dayjs";

const columnsTemplate: TableColumnsType<ShiftType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 250,
  },
  {
    title: "Start Time",
    dataIndex: "start_time",
    key: "start_time",
    width: 150,
  },
  {
    title: "End Time",
    dataIndex: "end_time",
    key: "end_time",
    width: 150,
  }
];

interface Data {
  data: ShiftType[];
  pagination: {
    totalItems: number;
  };
}

interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

const App: React.FC = () => {
  const { useFetchAll, useCreate, useUpdate, useDelete } = useCrud("shifts");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState<ShiftType | null>(null);

  const { data, isLoading } = useFetchAll({
    page: pagination.current,
    limit: pagination.pageSize,
    keyword,
  }) as { data: Data; isLoading: boolean };

  const createShift = useCreate();
  const updateShift = useUpdate();
  const deleteShift = useDelete();

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination({
      current: pagination.current as number,
      pageSize: pagination.pageSize as number,
    });
  };

  const handleAdd = () => {
    setIsEdit(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: ShiftType) => {
    setIsEdit(true);
    setEditingRecord({
      id: record.id,
      name: record.name,
      start_time: record.start_time,
      end_time: record.end_time
    });
    form.setFieldsValue({
        ...record,
        start_time: dayjs(record.start_time, "HH:mm:ss"),
        end_time: dayjs(record.end_time, "HH:mm:ss")
    });
    setIsModalOpen(true);
  };
  
  const handleSubmit = async (values: ShiftType) => {
    const start_time = dayjs(values.start_time).format("HH:mm:ss");
    const end_time = dayjs(values.end_time).format("HH:mm:ss");

    values.start_time = start_time;
    values.end_time = end_time;

    try {
      if (isEdit && editingRecord) {
        await updateShift.mutateAsync({
          id: editingRecord.id ?? "",
          payload: values,
        });
        message.success("Shift updated successfully");
      } else {
        await createShift.mutateAsync(values);
        message.success("Shift added successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      message.error(
        "Failed to save shift : " + errorResponse.response.data.message || ""
      );
    }
  };

  const columns: TableColumnsType<ShiftType> = [
    ...columnsTemplate,
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <div style={{ display: "flex", gap: "15px" }}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure?"
            okText="Yes"
            cancelText="No"
            onConfirm={async () => {
              try {
                await deleteShift.mutateAsync(record.id ?? "");
                message.success("Shift deleted successfully");
              } catch (error) {
                const errorResponse = error as ErrorResponse;
                message.error(
                  "Failed to save shift : " +
                    errorResponse.response.data.message || ""
                );
              }
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 mt-2 flex items-center justify-between">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by name"
          size="middle"
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 300 }}
        />
        <Button type="primary" size="middle" onClick={handleAdd}>
          Add Shift
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.data}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.pagination?.totalItems,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", "40", "50"],
        }}
        onChange={handleTableChange}
        bordered
      />
      <Modal
        title={isEdit ? "Edit Shift" : "Add Shift"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: isEdit ? false : true,
                message: "Please input the name!",
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Start Time"
            name="start_time"
            rules={[
              {
                required: isEdit ? false : true,
                message: "Please input the start time!",
              },
            ]}
          >
            <TimePicker format="HH:mm:ss" needConfirm={false} />
          </Form.Item>
          <Form.Item
            label="End Time"
            name="end_time"
            rules={[
              {
                required: isEdit ? false : true,
                message: "Please input the end_time!",
              },
            ]}
          >
            <TimePicker format="HH:mm:ss" needConfirm={false} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
