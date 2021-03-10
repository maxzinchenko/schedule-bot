export const REQUEST_TYPE = {
  schedule: 'schedule' as 'schedule',
  groups: 'groups' as 'groups',
  teachers: 'teachers' as 'teachers'
}

export const REQUEST_N = {
  schedule: 700 as 700,
  groups: 701 as 701,
  teachers: 701 as 701
};

export const REQUEST_DATA = {
  schedule: { faculty: 0, teacher: '', group: '', sdate: '', edate: '', n: 700 },
  groups: { faculty: 0, lev: 142, n: 701 },
  teachers: { faculty: 0, lev: 141, n: 701 }
};
