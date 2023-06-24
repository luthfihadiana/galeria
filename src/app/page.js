"use client";
import {useState, useEffect } from 'react';
import Image from 'next/image'
import styles from './page.module.css'
import Modal from '@/components/Modal'
import axios from 'axios';
import debounce from 'lodash.debounce';

export default function Home() {
  const [currPhoto, setCurrPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [photos, setPhotos]= useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{  
    const fetchData = async() =>{
      try{
        const res = await axios.get(`/api/photos?&page=${page}`);
        const photos = [...res?.data?.photos];
        setPhotos(photos);
      } catch(error){
        console.error('Error fetching search results:', error);
      }finally{
        setIsLoading(false);
      }
    }
    fetchData();
  },[]);

  useEffect(() => {
    const fetchData = async() =>{
      const res = await axios.get(`/api/photos?search=${searchTerm}&page=${page}`);
      const photos = [...res?.data?.photos];
      setPhotos(photos);
    }
    const fetchSearchResults = debounce(async () => {
      try {
        fetchData();
      } catch (error) {
        console.error('Error fetching search results:', error);
      }finally{
        setIsLoading(false);
      }
    }, 500);

    setIsLoading(true);
    setPhotos([]);
    fetchSearchResults();

    return () => {
      fetchSearchResults.cancel();
    };
  }, [searchTerm]);

  const fetchMore = async() =>{
    setIsLoading(true);
    const newPage = page + 1;
    const res = await axios.get(`/api/photos?&page=${newPage}`);
    const photos = [...res?.data?.photos];
    setPage(prev => prev + 1);
    setPhotos(prev => [...prev, ...photos]);
    setIsLoading(false);
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Galeria.</h1>
      </header>
      <section className={styles.container}>
        <div className={styles.content}>
          <input 
            type="text" 
            className={styles.inputSearch}
            onChange={(e)=>{
              setSearchTerm(e.target.value);
            }}
            placeholder='Search photo'
            value={searchTerm}
          />
          <div className={styles.grid}>
            {
              photos?.map((el, idx) => (
                <a className={styles.card} onClick={()=>setCurrPhoto({
                    photo: el?.url, 
                    author: el?.author,
                    width: el?.width,
                    height: el?.height,
                  })} key={`image-${idx}`}>
                  <Image
                    src={el?.thumb}
                    alt='gallery-photo'
                    width={100}
                    height={100}
                    className={styles.image}
                  />
                  <div className={styles.details}>
                    <p className={styles.title}>Bebas</p>
                    <p className={styles.author}>by {el?.author}</p>
                  </div>
                </a>
              ))
            }
          </div>
          {isLoading && <p>Loading ....</p>}
          <button className={styles.load} onClick={fetchMore}>Load more</button>
        </div>
      </section>
      <Modal visible={!!currPhoto}>
        <div className={styles.imageClose} onClick={()=>setCurrPhoto(null)}>
          X
        </div>
        <Image
          src={currPhoto?.photo ? `${currPhoto?.photo}&w=${300}&h=${300}` :''}
          alt='gallery-photo'
          width={300}
          height={300}
          className={styles.imageView}
        />
        <div className={styles.imageDesc}>
          <p>Bebas</p>
          <p className={styles.author}>by {currPhoto?.author}.</p>
        </div>
      </Modal>
    </main>
  )
}
