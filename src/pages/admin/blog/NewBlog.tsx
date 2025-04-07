
import React from 'react';
import BlogForm from './BlogForm';
import { AdminLayout } from '@/components/admin/AdminLayout';

const NewBlog = () => {
  return (
    <AdminLayout>
      <BlogForm />
    </AdminLayout>
  );
};

export default NewBlog;
