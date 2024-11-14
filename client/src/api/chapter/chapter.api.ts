import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'
import { DataListChapter, IChapter, ListChapterParams } from './chapter.interface';

export const importChapters = async (chapters: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/chapters/importChapters', { chapters }, { withCredentials: true });
}

export const getListChapter = async ({params}: {params?: ListChapterParams}): Promise<AxiosResponse<DataListChapter>> => {
    return await requestWithJwt.get<DataListChapter>('/chapters', { params })
}
export const getListChapterNoPaging = async ({params}: {params?: ListChapterParams}): Promise<AxiosResponse<DataListChapter>> => {
    return await requestWithJwt.get<DataListChapter>('/chapters/getListChapterNoPaging', { params })
}
export const getChapterById = async (chapterId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>(`/chapters/getChapterById/${chapterId}`);
}

export const getListAllChapter = async (): Promise<AxiosResponse<DataListChapter>> => {
    console.log('getListAllChapter');
    return await requestWithJwt.get<DataListChapter>('/chapters/getListAllChapter', { withCredentials: true });
}

export const addChapter = async (chapter: IChapter): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/chapters', chapter, { withCredentials: true });
}

export const updateChapter = async (id: string, chapter: IChapter): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.put<any>('/chapters/'+ id, chapter , { withCredentials: true });
}

export const deleteChapter = async (id: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.delete<any>('/chapters/'+ id,  { withCredentials: true });
}