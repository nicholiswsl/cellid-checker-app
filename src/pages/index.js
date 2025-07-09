// src/pages/index.js
import Head from 'next/head';
import React, {useState} from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';

// --- Perbaikan di sini: Menggunakan dynamic import untuk MapComponent ---
import dynamic from 'next/dynamic';

const DynamicMapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false, // Ini sangat penting: Pastikan komponen hanya di-render di sisi klien
  loading: () => <p>Memuat peta...</p>, // Opsional: Tampilkan indikator loading
});
// --- Akhir perbaikan ---

export default function Home() {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async ({ mcc, radioType, mnc, lac, cid, address }) => {
    setLoading(true);
    setError(null);
    setLocationData(null); // Clear previous location

    try {
      const response = await fetch(`/api/cellid?mcc=${mcc}&radioType=${radioType}&mnc=${mnc}&lac=${lac}&cid=${cid}&address=${address}`);
      const data = await response.json();

      if (response.ok) {
        if (data && data.status === 'ok' && data.lat && data.lon) {
          setLocationData(data);
        } else {
          setError(data.message || 'Lokasi tidak ditemukan atau data tidak valid.');
        }
      } else {
        setError(data.message || 'Gagal mengambil data lokasi.');
      }
    } catch (err) {
      console.error("Error during API call:", err);
      setError('Terjadi kesalahan tak terduga. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Cell ID Checker</title>
        <meta name="description" content="Check cell ID location" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar onSearch={handleSearch} />

      <main className={styles.main}>
        {loading && <p>Mencari lokasi...</p>}
        {error && <p className={styles.error}>Error: {error}</p>}
        {locationData && (
          <div className={styles.mapWrapper}>
            {/* Menggunakan komponen peta yang diimpor secara dinamis */}
            <DynamicMapComponent location={locationData} />
          </div>
        )}
        {!locationData && !loading && !error && (
            <p className={styles.placeholderText}>Masukkan MCC, MNC, LAC, dan CID untuk melihat lokasi pada peta.</p>
        )}
      </main>
    </div>
  );
}
