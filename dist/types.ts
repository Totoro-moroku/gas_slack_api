interface UserToken {
  token: string
  id: string
}

interface UserStatus {
  status_text?: string
  status_emoji: string
  status_expiration?: number
}

interface UserPresence {
  ok: boolean
  presence: 'away' | 'active'
  online: boolean
  auto_away: boolean
  manual_away: boolean
  connection_count: number
}

interface UserProfile {
  ok: boolean
  profile: {
    title: string
    phone: string
    skype: string
    real_name: string
    real_name_normalized: string
    display_name: string
    display_name_normalized: string
    fields: object
    status_text: string
    status_emoji: string
    status_emoji_display_info: string[]
    status_expiration: number
    avatar_hash: string
    image_original: string
    is_custom_image: boolean
    email: string
    huddle_state: string
    huddle_state_expiration_ts: number
    first_name: string
    last_name: string
    image_24: string
    image_32: string
    image_48: string
    image_72: string
    image_192: string
    image_512: string
    image_1024: string
    status_text_canonical: string
  }
}
