import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ItemForm from './pages/ItemForm';
import BulkUpload from './pages/BulkUpload';
import ItemsList from './pages/ItemsList';
import useItemsStore from './stores/itemsStore';

function App() {
  const { fetchItems } = useItemsStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<ItemForm />} />
        <Route path="/bulk-upload" element={<BulkUpload />} />
        <Route path="/items" element={<ItemsList />} />
      </Routes>
    </Layout>
  );
}

export default App;
