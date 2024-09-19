import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'
import { DataListChapter, IChapter, ListChapterParams } from './chapter.interface';

export const importChapters = async (chapters: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/chapters/importChapters', { chapters }, { withCredentials: true });
}

export const getListChapter = async ({params}: {params?: ListChapterParams}): Promise<AxiosResponse<DataListChapter>> => {
    return await requestWithJwt.get<DataListChapter>('/chapters', { params })
}
export const getChapterById = async (chapterId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>(`/chapters/${chapterId}`);
}