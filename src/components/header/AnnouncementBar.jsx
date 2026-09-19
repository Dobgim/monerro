import { useSiteState } from '../../store/siteStore'

// Top promo strip above the header (editable in Admin → Announcement)
export default function AnnouncementBar() {
  const promo = useSiteState((s) => s.announcement)

  return (
    <div className="l-subheader at_top width_full_with_indents">
      <div className="l-subheader-h">
        <div className="l-subheader-cell at_left" />
        <div className="l-subheader-cell at_center">
          {promo.enabled && promo.text && (
            <div className="w-text ush_text_54 has_text_color">
              <a href={promo.href || '#'} className="w-text-h">
                <span className="w-text-value">{promo.text}</span>
              </a>
            </div>
          )}
        </div>
        <div className="l-subheader-cell at_right" />
      </div>
    </div>
  )
}
