package cn.lalaframework.nad;

import cn.lalaframework.nad.models.Manifest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.annotation.PostConstruct;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(classes = TestApplication.class)
class NadUiConfigurationTest {
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @PostConstruct
    void init() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void entry() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/nad/"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.header().string("Cache-Control", "no-cache"))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.TEXT_HTML));
    }

    @Test
    void logo() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/nad/logo.svg"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.header().string("Cache-Control", "max-age=3600"))
                .andExpect(MockMvcResultMatchers.content().contentType("image/svg+xml"));
    }

    @Test
    void notFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/nad/404"))
                .andExpect(MockMvcResultMatchers.status().is4xxClientError());
    }

    @Test
    void resource() throws Exception {
        MvcResult res = mockMvc.perform(MockMvcRequestBuilders.get("/nad/asset-manifest.json"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andReturn();
        ObjectMapper mapper = new ObjectMapper();
        Manifest manifest = mapper.readValue(res.getResponse().getContentAsByteArray(), Manifest.class);
        assertNotNull(manifest);
        Map<String, String> files = manifest.getFiles();
        assertNotNull(files);
        for (Map.Entry<String, String> entry : files.entrySet()) {
            String path = entry.getValue();
            mockMvc.perform(MockMvcRequestBuilders.get(path))
                    .andExpect(MockMvcResultMatchers.status().isOk());
        }
    }
}