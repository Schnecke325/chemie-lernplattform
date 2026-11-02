export type PageId = 'dashboard' | 'lernen' | 'uebungen' | 'abiturarchiv' | 'fortschritt'

export interface NavigationItem {
  id: PageId
  label: string
  icon: string
}
