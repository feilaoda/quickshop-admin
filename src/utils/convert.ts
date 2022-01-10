export function convertData(data: any[], field: string) {
  const fields = field.split('.');
  if (fields.length < 2) {
    return data;
  }
  data.forEach((e) => {
    if (e[fields[0]] !== undefined && e[fields[0]] !== null) {
      if (Array.isArray(e[fields[0]])) {
        const values: any = [];
        e[fields[0]].forEach((el: any) => {
          if (el[fields[1]] !== undefined && el[fields[1]] !== null) {
            values.push(el[fields[1]]);
          }
        });
        e[field] = values.join(',');
      } else {
        e[field] = e[fields[0]][fields[1]];
      }
    }
  });
  return data;
}

export function collectIds(data: any[]) {
  const res = data.reduce((buf, value) => {
    return buf.concat(value.id);
  }, []);
  console.log('collect ids', res);
  return res;
}

export function transformData(data: Record<string, any>) {
  return Object.entries(data).reduce((buf, [_, v]) => {
    return buf.concat({
      label: v.name,
      value: v.id,
    });
  }, []);
}

export function deleteData(data: Record<string, any>, id: string) {
  return data.filter((e: any) => e.value != id);
}

export function intConvertToArray(arr: any[], num: number) {
  const res: number[] = [];
  arr.forEach((v) => {
    if ((num & v.id) == v.id) {
      return res.push(v.id);
    }
  });
  return res;
}

export function intConvertToString(arr: any[], num: number) {
  if (num === undefined || num === null) {
    return '';
  }
  const res: string[] = [];
  if (num == 255) {
    return '全部';
  }
  arr.forEach((v) => {
    if ((num & v.id) == v.id) {
      return res.push(v.name);
    }
  });
  return res.join(',');
}
