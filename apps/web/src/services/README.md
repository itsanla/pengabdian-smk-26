# Penjelasan `api.services.ts`

Fungsi `apiRequest` menerima parameter:
  * `endpoint`: URL yang akan diakses.
  * `method`: HTTP method seperti `GET`, `POST`, `PUT`, `DELETE`, dll. Defaultnya adalah `GET`.
  * `data`: Body request jika diperlukan (pada `POST` atau `PUT`).
  * `token`: Token yang akan dimasukkan ke dalam header `Authorization`.
Fungsi ini kemudian melakukan request menggunakan `fetch` dan mengirimkan token (jika ada) dalam header.

# Contoh Penggunaan

## Contoh 1: Mengambil Data Barang

```tsx
import { useEffect, useState } from 'react';
import { apiRequest } from '@/services/api.service'; // Mengimpor fungsi apiRequest
import { Barang } from '@/types';

export default function Dashboard() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest({
          endpoint: '/api/barang',
          token: token
        });
        // Data adalah response dari API, sesuaikan dengan struktur data yang diharapkan
        setBarang(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {barang.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

## Contoh 2: Mengirim Data untuk Create atau Update

```tsx
import { useState } from 'react';
import { apiRequest } from '@/services/api'; // Mengimpor fungsi apiRequest

export default function CreateBarang() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newBarang = {
      name,
      quantity,
      // ... data lain yang diperlukan
    };

    try {
      const data = await apiRequest({ 
        endpoint: '/api/barang', 
        method: 'POST', 
        data: newBarang, 
        token 
      });
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Name" 
      />
      <input 
        type="number" 
        value={quantity} 
        onChange={(e) => setQuantity(Number(e.target.value))} 
        placeholder="Quantity" 
      />
      <button type="submit">Create</button>
    </form>
  );
};
```
