// src/components/Navbar.js
import React, { useState } from 'react';
import styles from '../styles/Navbar.module.css';

const Navbar = ({ onSearch, loading }) => {
  // MCC akan memiliki nilai default 510
  const [mcc, setMcc] = useState('510');
  // RADIO akan memiliki nilai default kosong (untuk opsi "Pilih Jaringan")
  const [radioType, setRadio] = useState('');
  // MNC akan memiliki nilai default kosong (untuk opsi "Pilih Operator")
  const [mnc, setMnc] = useState('');
  const [lac, setLac] = useState('');
  const [cid, setCid] = useState('');
  const [inputError, setInputError] = useState('');

  // Daftar opsi untuk Radio (Jaringan)
  const radioOptions = [
    { label: 'Pilih Jaringan', value: '', disabled: true },
    { label: '2G (GSM)', value: 'gsm' },
    { label: '3G (UMTS)', value: 'umts' },
    { label: '4G (LTE)', value: 'lte' },
    { label: 'NB-IoT', value: 'nbiot' },
  ];

  // Daftar opsi untuk MNC (Operator)
  const mncOptions = [
    { label: 'Pilih Operator', value: '', disabled: true },
    { label: 'Telkomsel', value: '10' },
    { label: 'XL', value: '11' },
    { label: 'Indosat Ooredoo', value: '01' },
    { label: 'IM3', value: '21' },
    { label: 'Three', value: '89' },
    { label: 'Smartfren', value: '09' },
  ];

  const validateInputs = () => {
    if (!mcc || !radioType || !mnc || !lac || !cid) {
      setInputError('Semua kolom harus diisi.');
      return false;
    }
    if (isNaN(lac) || isNaN(cid)) {
      setInputError('LAC dan CID harus berisi angka.');
      return false;
    }
    setInputError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      // Pastikan untuk mengirim nilai radio juga ke onSearch
      onSearch({ mcc, radioType, mnc, lac, cid });
    }
  };

  // Cek apakah semua input (termasuk select) sudah terisi
  const isFormComplete = mcc && radioType && mnc && lac && cid;

  return (
    <nav className={styles.navbar}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="mcc">MCC:</label>
          <select
            id="mcc"
            value={mcc}
            onChange={(e) => { setMcc(e.target.value); setInputError(''); }}
            className={styles.select} // Gunakan class terpisah untuk styling select
            disabled={true} // MCC bersifat fixed 510
          >
            <option value="510">510 (Indonesia)</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="radioType">Jaringan:</label>
          <select
            id="radioType"
            value={radioType}
            onChange={(e) => { setRadio(e.target.value); setInputError(''); }}
            className={styles.select}
          >
            {radioOptions.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="mnc">Operator (MNC):</label>
          <select
            id="mnc"
            value={mnc}
            onChange={(e) => { setMnc(e.target.value); setInputError(''); }}
            className={styles.select}
          >
            {mncOptions.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="lac">LAC:</label>
          <input
            id="lac"
            type="text"
            placeholder="LAC"
            value={lac}
            onChange={(e) => { setLac(e.target.value); setInputError(''); }}
            className={styles.input}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="cid">CID:</label>
          <input
            id="cid"
            type="text"
            placeholder="CID"
            value={cid}
            onChange={(e) => { setCid(e.target.value); setInputError(''); }}
            className={styles.input}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={loading || !isFormComplete}
        >
          {loading ? 'Mencari...' : 'Cari Lokasi'}
        </button>
      </form>
      {inputError && <p className={styles.inputErrorMessage}>{inputError}</p>}
    </nav>
  );
};

export default Navbar;