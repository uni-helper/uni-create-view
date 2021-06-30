type ERecurs = Promise<null | { path: string, data: string }>;

interface CreateViewV2TemplateOptions {
  viewName: string
  typescript?: boolean | unknown
  styleType?: string | unknown
  component?: boolean
  compositionApi?: boolean | unknown
}

interface EcreateUniAppView {
  create_path: string
  viewName: string
  pageName?: string
  subcontract?: boolean
  component?: boolean
  directory?: boolean | unknown
  typescript?: boolean | unknown
  styleType?: string | unknown
  compositionApi?: boolean | unknown
}

interface GetCommandExtOpts {
  tipsViewNmae: string
  extname: string
  options?: Partial<EcreateUniAppView>
}