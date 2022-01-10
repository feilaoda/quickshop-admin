import shopapi from '@/services/shopapi';

const transformData = (data = []) => {
  return data.reduce((buf, value: any) => {
    return buf.concat({
      label: value.name,
      value: value.id,
    });
  }, []);
};

export function getDepartments() {
  return shopapi.DepartmentApi.getDepartments()
    .then((res) => {
      if (res.code == 0) {
        return res.data;
      } else {
        return [];
      }
    })
    .then((data) => {
      return transformData(data);
    });
}

export function getRoles() {
  return shopapi.ResourceApi.getResources('system', 'sysRole')
    .then((res) => {
      if (res.code == 0) {
        return res.data;
      } else {
        return [];
      }
    })
    .then((data) => {
      return transformData(data);
    });
}
