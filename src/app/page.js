"use client";
import {useState, useEffect } from 'react';
import Image from 'next/image'
import styles from './page.module.css'
import Modal from '@/components/Modal'
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function Home() {
  const [currPhoto, setCurrPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [photos, setPhotos]= useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(()=>{  
    const fetchData = async() =>{
      try{
        const res = await axios.get(`/api/photos?&page=${page}`);
        const photos = [...res?.data?.photos];
        setPhotos(photos);
        if(photos?.length <= 0){
          setIsLastPage(true);
        }
      } catch(error){
        console.error('Error fetching search results:', error);
      }finally{
        setIsLoading(false);
      }
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    const fetchData = async() =>{
      const res = await axios.get(`/api/photos?search=${searchTerm}&page=${page}`);
      const photos = [...res?.data?.photos];
      setPhotos(photos);
      if(photos?.length < 9){
        setIsLastPage(true);
      }
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
    setIsLastPage(false);
    setIsLoading(true);
    setPhotos([]);
    fetchSearchResults();

    return () => {
      fetchSearchResults.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSelectPhoto = (photo) =>{
    setCurrPhoto({
      photo: photo?.url, 
      author: photo?.author,
      width: photo?.width,
      height: photo?.height,
    });
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
              photos?.map(el => (
                <a className={styles.card} onClick={()=>handleSelectPhoto(el)} 
                  key={el?.id}
                  id={`image-${el?.id}`}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={el?.description}
                  data-tooltip-place="bottom"
                >
                  <Image
                    src={el?.thumb}
                    alt='gallery-photo'
                    width={100}
                    height={100}
                    className={styles.image}
                  />
                  <div className={styles.details}>
                    <p className={styles.author}>by {el?.author}</p>
                  </div>
                </a>
              ))
            }
          </div>
          <ReactTooltip
            id="tooltip"
            className={styles?.descTooltip}
          />
          {isLoading && <p>Loading ....</p>}
          {photos?.length <=0 && !isLoading && <p className={styles.notFound}>No Photo Found</p>}
          {!isLastPage && <button className={styles.load} onClick={fetchMore}>Load more</button>}
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
          <p className={styles.author}>by {currPhoto?.author}.</p>
        </div>
      </Modal>
    </main>
  )
}
