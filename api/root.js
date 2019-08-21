import request from '@/common/request'
const pageSize =20;
export default {
  root_item(map = {}) {
    return new Promise((resolve, reject) => {
      request.get("/root:/app/我的:/children?select=id,name,size,lastModifiedDateTime,createdDateTime,folder,file,@microsoft.graph.downloadUrl&$expand=thumbnails($select=small)&$top="+pageSize, map).then(response => {
        resolve(response)
      })
    })
  },
  get_drives(id,map = {}) {
    return new Promise((resolve, reject) => {
      request.get("/items/"+id+"/children?select=id,name,size,lastModifiedDateTime,createdDateTime,folder,file,@microsoft.graph.downloadUrl&$expand=thumbnails($select=small,medium,large)&$orderby=name&$top="+pageSize, map).then(response => {
        resolve(response)
      })
    })
  },
  get_images(id,map = {}) {
    return new Promise((resolve, reject) => {
      request.get("/items/"+id+"/children?select=id,name,size,lastModifiedDateTime,createdDateTime,folder,file,@microsoft.graph.downloadUrl&$expand=thumbnails($select=medium,large)&$top="+pageSize, map).then(response => {
        resolve(response)
      })
    })
  },
  search(Keyword,map = {}) {
    return new Promise((resolve, reject) => {
      request.get("root/search(q='"+Keyword+"')?select=id,name,size,lastModifiedDateTime,folder,file,content.downloadUrl&$expand=thumbnails($select=small)&$top="+pageSize, map).then(response => {
        resolve(response)
      })
    })
  },
  nextPage(url,map = {}) {
    return new Promise((resolve, reject) => {
      request.get(url, map).then(response => {
        resolve(response)
      })
    })
  }
}