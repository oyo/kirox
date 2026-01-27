import iconOk from './ok.svg'
import iconNok from './nok.svg'

export const Okay = (ok: boolean) => (ok ? iconOk : iconNok)
