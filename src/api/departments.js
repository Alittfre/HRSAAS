import request from '@/utils/request.js'

export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

export function editDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'PUT'
  })
}

export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
