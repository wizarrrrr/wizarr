resource "cloudflare_pages_domain" "wizarr_app_release_domain" {
  account_id   = var.cloudflare_account_id
  project_name = data.terraform_remote_state.cloudflare_account.outputs.wizarr_app_archive_pages_project_name
  domain       = "docs.wizarr.app"
}

resource "cloudflare_record" "wizarr_app_release_domain" {
  name = "docs.wizarr.app"
  proxied = true
  ttl = 1
  type = "CNAME"
  content = data.terraform_remote_state.cloudflare_wizarr_app_docs.outputs.wizarr_app_branch_pages_hostname
  zone_id = data.terraform_remote_state.cloudflare_account.outputs.wizarr_app_zone_id
}
