
export function convertData(data: any[], field: string) {
    const fields = field.split('.');
    data.forEach(e => {
      if(e[fields[0]] !== undefined && e[fields[0]] !== null) {
        if(Array.isArray(e[fields[0]])) {
            const values: any = []
            e[fields[0]].forEach((el: any)=> {
                if(el[fields[1]] !== undefined && el[fields[1]] !== null) {
                    values.push(el[fields[1]]);
                }
            })
            e[field] = values.join(',')
        }else {
            e[field] = e[fields[0]][fields[1]]
        }
      }
    })
    return data
  }