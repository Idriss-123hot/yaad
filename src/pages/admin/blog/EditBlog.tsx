
import React from 'react';
import BlogForm from './BlogForm';
import { AdminLayout } from '@/components/admin/AdminLayout';

const EditBlog = () => {
  return (
    <AdminLayout>
      <BlogForm />
    </AdminLayout>
  );
};

export default EditBlog;
