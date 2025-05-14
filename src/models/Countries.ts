export interface Countries{
  name: string,
  code: number,
  codename: number,
  division_type: string,
  phone_code: number,
  districts: districts[]
}

export interface districts {
  name: string,
  code: number,
  codename: number,
  division_type: string,
  wards: wards[]
}

export interface wards {
  name: string,
  code: number,
  codename: number,
  division_type: string,
  short_codename: string,
}