resource "cloudflare_pages_domain" "wizarr_app_branch_domain" {
  account_id   = var.cloudflare_account_id
  project_name = local.is_release ? data.terraform_remote_state.cloudflare_account.outputs.wizarr_app_archive_pages_project_name : data.terraform_remote_state.cloudflare_account.outputs.wizarr_app_preview_pages_project_name
  domain       = "${var.prefix_name}.${local.deploy_domain_prefix}.wizarr.org"
}

resource "cloudflare_record" "wizarr_app_branch_subdomain" {
  name    = "${var.prefix_name}.${local.deploy_domain_prefix}.wizarr.org"
  proxied = true
  ttl     = 1
  type    = "CNAME"
  content   = "${replace(var.prefix_name, "/\\/|\\./", "-")}.${local.is_release ? data.terraform_remote_state.cloudflare_account.outputs.wizarr_app_archive_pages_project_subdomain : data.terraform_remote_state.cloudflare_account.outputs.wizarr_app_preview_pages_project_subdomain}"
  zone_id = data.terraform_remote_state.cloudflare_account.outputs.wizarr_app_zone_id
}

output "wizarr_app_branch_subdomain" {
  value = cloudflare_record.wizarr_app_branch_subdomain.hostname
}

output "wizarr_app_branch_pages_hostname" {
  value = cloudflare_record.wizarr_app_branch_subdomain.content
}

output "pages_project_name" {
  value = cloudflare_pages_domain.wizarr_app_branch_domain.project_name
}
