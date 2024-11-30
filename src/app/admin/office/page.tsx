"use client";

import React, { useState } from "react";
import { Button, Input, Modal, Table, Form, message, Popconfirm } from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { useCrud } from "@/hooks/use-crud";
import { OfficeType } from "@/types";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const columnsTemplate: TableColumnsType<OfficeType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 250,
  },
  {
    title: "Latitude",
    dataIndex: "latitude",
    key: "latitude",
    width: 150,
  },
  {
    title: "Longitude",
    dataIndex: "longitude",
    key: "longitude",
    width: 150,
  },
  {
    title: "Radius",
    dataIndex: "radius",
    key: "radius",
    width: 150,
  },
];

interface Data {
  data: OfficeType[];
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
  const { useFetchAll, useCreate, useUpdate, useDelete } = useCrud("offices");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState<OfficeType | null>(null);

  const { data, isLoading } = useFetchAll({
    page: pagination.current,
    limit: pagination.pageSize,
    keyword,
  }) as { data: Data; isLoading: boolean };

  const createOffice = useCreate();
  const updateOffice = useUpdate();
  const deleteOffice = useDelete();

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

  const handleEdit = (record: OfficeType) => {
    setIsEdit(true);
    setEditingRecord({
      id: record.id,
      name: record.name,
      latitude: parseFloat(String(record.latitude)),
      longitude: parseFloat(String(record.longitude)),
      radius: Number(record.radius),
    });
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };
  
  const handleSubmit = async (values: OfficeType) => {
    try {
      if (isEdit && editingRecord) {
        await updateOffice.mutateAsync({
          id: editingRecord.id ?? "",
          payload: values,
        });
        message.success("Office updated successfully");
      } else {
        await createOffice.mutateAsync(values);
        message.success("Office added successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      message.error(
        "Failed to save office : " + errorResponse.response.data.message || ""
      );
    }
  };

  const columns: TableColumnsType<OfficeType> = [
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
                await deleteOffice.mutateAsync(record.id ?? "");
                message.success("Office deleted successfully");
              } catch (error) {
                const errorResponse = error as ErrorResponse;
                message.error(
                  "Failed to save office : " +
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
          Add Office
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
        title={isEdit ? "Edit Office" : "Add Office"}
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
            label="Latitude"
            name="latitude"
            rules={[
              {
                required: isEdit ? false : true,
                message: "Please input the latitude!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Longitude"
            name="longitude"
            rules={[
              {
                required: isEdit ? false : true,
                message: "Please input the longitude!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Radius"
            name="radius"
            rules={[
              {
                required: isEdit ? false : true,
                message: "Please input the radius!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
