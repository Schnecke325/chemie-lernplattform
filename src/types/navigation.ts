export type PageId = 'dashboard' | 'lernen' | 'uebungen' | 'abiturarchiv' | 'fortschritt' | 'admin' | 'datenschutz'

export interface NavigationItem {
  id: PageId
  label: string
  icon: string
}
