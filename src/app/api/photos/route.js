import { NextResponse } from 'next/server';
import unsplash from '@/api/unsplash';

export async function GET(request) {
  let photos = [];
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const page = searchParams.get('page');
  if(search){
    try{
      const result = await unsplash.search.getPhotos({ page, perPage: 9, query: search });
      if (result.errors) {
        console.log('error occurred: ', result.errors[0]);
      } else {
        const results = result?.response?.results;
        photos = results?.map(el =>({
          id: el?.id,
          author: el?.user?.username,
          description: el?.description,
          url: el?.urls?.raw,
          thumb: el?.urls?.thumb,
          width: el?.width,
          height: el?.height,
        }));
      }
    } catch(e){
      throw e;
    }
  }else{
    try{
      const result = await unsplash.photos.list({ page, perPage: 9 });
      if (result.errors) {
        console.log('error occurred: ', result.errors[0]);
      } else {
        const results = result?.response?.results;
        photos = results?.map(el =>({
          id: el?.id,
          author: el?.user?.username,
          description: el?.description,
          url: el?.urls?.raw,
          thumb: `${el?.urls?.raw}&w=300&fit=max`,
          width: el?.width,
          height: el?.height,
        }));
      }
    } catch(e){
      throw e;
    }
  }

  return NextResponse.json({ photos });
}