require 'uri'

class CustomRender < Redcarpet::Render::HTML
  require 'rouge'
  require 'rouge/plugins/redcarpet'
  include Rouge::Plugins::Redcarpet
end

class Post < ApplicationRecord
  include Tokenable
  belongs_to :author

  def next
    posts = author.listed_posts
    index = posts.index(self)
    posts[index - 1] if index&.positive?
  end

  def previous
    posts = author.listed_posts
    index = posts.index(self)
    posts[index + 1] if index
  end

  def url
    if unlisted
      tokenized_url
    else
      author_relative_url
    end
  end

  def tokenized_url
    "#{self.author.get_host}/p/#{self.token}"
  end

  def author_relative_url
    if self.author && self.author.has_custom_domain
      "https://#{self.author.custom_domain}#{self.path}"
    else
      "#{ENV['HOST']}#{self.path}"
    end
  end

  def preview_text
    # Render to remove Markdown syntax
    result = self.rendered_text
    # Remove HTML syntax
    result = ActionView::Base.full_sanitizer.sanitize(result)

    limit = 500
    return result[0, 500] + "..."
  end

  def rendered_text(limit = nil)
    return get_rendered_text(self.text, limit)
  end

  def get_rendered_text(input, limit = nil)
    return nil if input == nil
    options = {
      filter_html: false,
      hard_wrap: true,
      # Use sanitize's 'add_attributes' instead
      # link_attributes: { rel: 'nofollow noopener', target: "_blank" },
      space_after_headers: true,
      fenced_code_blocks: true,
      prettify: true
    }

    extensions = {
      autolink: true,
      superscript: true,
      disable_indented_code_blocks: true,
      fenced_code_blocks: true,
      lax_spacing: true,
      tables: true,
      footnotes: true,
      highlight: true
    }

    renderer = CustomRender.new(options)
    markdown = Redcarpet::Markdown.new(renderer, extensions)

    text = markdown.render(limit ? (input[0, limit] + "...") : input)

    sanitized = Sanitize.fragment(text, Sanitize::Config.merge(Sanitize::Config::RELAXED,
      :elements => Sanitize::Config::RELAXED[:elements] + ['center', 'iframe', 'details'],
      :attributes => {'iframe' => ['src', 'width', 'height', 'frameborder', 'allow']},
      :transformers => link_transformer
    ))

    return sanitized.html_safe
  end

  def path
    return nil if !self.author

    if title
      prefix = (author.has_custom_domain) ? "" : "/#{author.url_segment}" + (author.has_username ? "" : "/posts")
      if page
        "#{prefix}/#{title.parameterize}"
      elsif author.has_username
        "#{prefix}/#{self.id}/#{self.title.parameterize}"
      else
        "#{prefix}/#{self.id}"
      end
    else
      "/#{author.url_segment}/#{self.id}/"
    end
  end

  def can_send_email
    self.unlisted == false && self.email_sent_date == nil
  end

  def link_transformer
    lambda do |env|
      node = env[:node]
      node_name = env[:node_name]

      # Don't continue if the node is not an element.
      return unless node.element?

      # Don't continue unless the node is a link.
      return unless node_name == 'a'

      begin
        node_url = URI.parse(node['href'])
        author_url = URI.parse(author_relative_url)
      rescue => e
        return
      end

      return if node_url.host.nil? || author_url.host.nil?
      # Do not process links which have images embedded
      return if node.children&.first&.name == 'img'

      # External links should have the "rel" and "target" attributes set.
      Sanitize.node!(
        node,
        {
          elements: ['a', 'a img'],
          attributes: {'a' => ['href']},
          add_attributes: {
            'a' => {'rel' => "noopener", 'target' => "_blank"}
          }
        }
      ) unless node_url.host.include? author_url.host

      { node_whitelist: [node] }
    end
  end

end
