import Http from '../utils/request'
export type WebsiteBaseInfoVO = {
  websiteName: string
  websiteIntroduction: string
  seoTitle: string
  seoContent: string
  seoKeywords: string
}
export const getWebsiteBaseInfo = () => {
  return Http.get(`/v1/configs/website`)
}

export const getWebsiteBaseInfoByAdmin = () => {
  return Http.get(`/v1/admin/configs/website`)
}

export const updateWebsiteBaseInfoByAdmin = (websiteBaseInfoVO: WebsiteBaseInfoVO) => {
  return Http.put(`/v1/admin/configs/website`, websiteBaseInfoVO)
}
