import request from '@/common/request'
const pageSize =20;
export default {
  get_new(type,map = {}) {
    return new Promise((resolve, reject) => {
      request.get("/root:/app/"+type+":/children?select=id,name,size,lastModifiedDateTime,createdDateTime,folder,file,@microsoft.graph.downloadUrl&$expand=thumbnails($select=large)&$orderby=name desc&$top="+pageSize, map).then(response => {
        resolve(response)
      })
    })
  },
  get_type(type,map = {}) {
    return new Promise((resolve, reject) => {
      request.get("/root:/app/分类:/children?select=id,name", map).then(response => {
        resolve(response)
      })
    })
  },
  get_children(type,folderName,map = {}) {
   return new Promise((resolve, reject) => {
     request.get("/root:/app/图片存放/"+type+"/"+folderName+":/children?select=id,name,size,lastModifiedDateTime,createdDateTime,folder,file,@microsoft.graph.downloadUrl&$expand=thumbnails($select=large)&$top="+pageSize, map).then(response => {
       resolve(response)
     })
   })
  },
  get_images(id,map = {}) {
    return new Promise((resolve, reject) => {
      request.get("/items/"+id+"/children?select=id,name,size,lastModifiedDateTime,createdDateTime,folder,file,@microsoft.graph.downloadUrl&$expand=thumbnails($select=large)&$top="+pageSize, map).then(response => {
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