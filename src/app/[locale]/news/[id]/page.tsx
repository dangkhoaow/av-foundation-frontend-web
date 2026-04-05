import type { Metadata } from 'next';
import NewsDetailClient from './NewsDetailClient';
import { withBasePath } from '@/lib/assets';

export const metadata: Metadata = {
  title: 'News Detail',
  description: 'Read the full news article',
};

interface NewsDetailPageProps {
  params: {
    id: string;
  };
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  // Mock data - will be replaced with API
  const article = {
    id: params.id,
    title: "Lorem ipsum dolor sit amet consectetur",
    subtitle: "Lorem ipsum dolor sit amet consectetur. Urna mauris amet ipsum risus pharetra mi nam turpis. Urna convallis cras nibh ullamcorper mi amet. Dolor sit sed accumsan et scelerisque sed quis.",
    heroImage: withBasePath("/images/news-detail/hero-1.jpg"),
    contentImage: withBasePath("/images/news-detail/content-1.jpg"),
    content: [
      "Lorem ipsum dolor sit amet consectetur. Massa turpis ullamcorper eget elementum feugiat sit quam dolor. Mauris in convallis interdum facilisis platea sapien. Scelerisque porttitor iaculis in mauris elementum eu vulputate. Viverra neque sit ridiculus orci amet quisque sodales sapien sollicitudin.",
      "Lorem ipsum dolor sit amet consectetur. Pellentesque viverra adipiscing vel dignissim elementum sed. Cum nec morbi posuere in hendrerit semper a ac massa. Blandit enim eu mauris lacus accumsan. Sit integer magna purus tincidunt in ipsum. Egestas nam nec suscipit dignissim tincidunt ac. Consequat volutpat odio tortor a nulla volutpat vehicula quis pharetra. Orci cursus consectetur vitae sit pulvinar tellus. Amet tortor.",
      "Lorem ipsum dolor sit amet consectetur. Leo morbi tincidunt integer consectetur nam eget vel gravida sem. Consectetur blandit suspendisse dui nulla ut purus sit. Volutpat iaculis ut mauris gravida. Amet in arcu purus leo maecenas euismod commodo. Aenean adipiscing pulvinar lectus urna tristique viverra a. Elit blandit venenatis ornare enim morbi maecenas et ultricies. Sed tortor facilisis nulla integer. Turpis habitasse nec aliquam nulla elementum sapien viverra feugiat et. Molestie mus tincidunt rhoncus.",
      "Lorem ipsum dolor sit amet consectetur. Amet eu convallis vivamus tortor urna magna tristique consectetur. Ornare ipsum sem phasellus non. Id semper auctor ut est tincidunt pellentesque eu ac. Felis nisi duis dictum euismod urna erat egestas malesuada sit. Sed cras nulla senectus urna urna.",
      "Lorem ipsum dolor sit amet consectetur. Facilisis justo nullam nulla consequat vulputate mi in sed mattis. Gravida augue mi suspendisse convallis. Varius nulla urna quis massa. Purus fermentum nunc faucibus felis tellus leo orci vulputate. Faucibus nunc nullam sit nulla. Vitae amet adipiscing etiam volutpat est libero eu et. Tellus nulla."
    ],
    contentBottom: [
      "Lorem ipsum dolor sit amet consectetur. Massa turpis ullamcorper eget elementum feugiat sit quam dolor. Mauris in convallis interdum facilisis platea sapien. Scelerisque porttitor iaculis in mauris elementum eu vulputate. Viverra neque sit ridiculus orci amet quisque sodales sapien sollicitudin.",
      "Lorem ipsum dolor sit amet consectetur. Pellentesque viverra adipiscing vel dignissim elementum sed. Cum nec morbi posuere in hendrerit semper a ac massa. Blandit enim eu mauris lacus accumsan. Sit integer magna purus tincidunt in ipsum. Egestas nam nec suscipit dignissim tincidunt ac. Consequat volutpat odio tortor a nulla volutpat vehicula quis pharetra. Orci cursus consectetur vitae sit pulvinar tellus. Amet tortor."
    ]
  };

  return <NewsDetailClient article={article} />;
}

