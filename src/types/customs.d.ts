type ERecurs = Promise<null | { path: string, data: string }>;

interface CreateViewV2TemplateOptions {
  view_name: string,
  typescript?: boolean | unknown,
  style_type?: string | unknown,
  component?: boolean
}

interface EcreateUniAppView {
  create_path: string
  view_name: string
  subcontract?: boolean
  component?: boolean
  directory?: boolean | unknown
  typescript?: boolean | unknown
  style_type?: string | unknown
}

interface GetCommandExtOpts {
  tipsViewNmae: string
  extname: string
  options?: Partial<EcreateUniAppView>
}